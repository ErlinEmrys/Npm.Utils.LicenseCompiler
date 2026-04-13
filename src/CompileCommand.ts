import type { ILicenseData } from "./License";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ValidationHelper } from "@erlinemrys/lib.common";
import { FormatJson } from "./JsonWritter";
import { LicenseData, LicenseDataType, LicensePackage } from "./License";
import { WriteOutputMD } from "./MarkdownWritter";

export interface ICompileOptions
{
	Source: string | undefined;
	MdFile: string | undefined;
	JsonFile: string | undefined;
}

export async function CompileCommand( options: ICompileOptions )
{
	try
	{
		Log.Dbg( "Compile command: START", options );

		if( !options.MdFile && !options.JsonFile )
		{
			Log.Wrn( "No output specified" );
			return;
		}

		await CompileLicences( options );
	}
	catch( e )
	{
		Log.Err( "Compile command: ERR", e );
	}
	finally
	{
		Log.Dbg( "Compile command: END" );
	}
}

async function CompileLicences( options: ICompileOptions )
{
	execFile( process.platform.startsWith( "win" ) ? "pnpm.cmd" : "pnpm", [ "licenses", "list", "--json", "--long", "-P" ], { shell: true, cwd: options.Source }, ( error, stdout, stderr ) =>
	{
		if( error || stderr )
		{
			Log.Err( "(P)NPM reading error", error, stderr );
		}
		else
		{
			let data;
			if( stdout.startsWith( "No licenses in packages found" ) )
			{
				data = {};
			}
			else
			{
				data = JSON.parse( stdout );
			}

			const packages = TransformPackages( data );

			if( options.JsonFile )
			{
				FormatJson( options.JsonFile, packages );
			}

			if( options.MdFile )
			{
				WriteOutputMD( options.MdFile, packages );
			}

			if( packages.Packages.some( fPackage => fPackage.LicenseDataType === LicenseDataType.Error || fPackage.LicenseDataType === LicenseDataType.EnumNullError ) )
			{
				Log.Err( "Some of licenses are in error state." );
				process.exitCode = 1;
			}
		}
	} );
}

export function GetLicenceFile( packagePath: string )
{
	const fileNames = [ "LICENSE", "LICENCE", "COPYING" ];
	return GetFileContent( packagePath, fileNames );
}

export function GetNoticeFile( packagePath: string )
{
	const fileNames = [ "NOTICE" ];
	return GetFileContent( packagePath, fileNames );
}

function GetFileContent( packagePath: string, fileNames: string[] )
{
	let licenseFileContent;

	for( const i in fileNames )
	{
		const regex = new RegExp( `${ fileNames[ i ] }.*?`, "i" );
		fs.readdirSync( packagePath ).some( ( file ) =>
		{
			const match = file.match( regex );
			if( match )
			{
				licenseFileContent = fs.readFileSync( path.join( packagePath, file ) ).toString();
			}

			return match;
		} );

		if( licenseFileContent )
		{
			break;
		}
	}

	return licenseFileContent;
}

function TransformPackages( data: any ): ILicenseData
{
	const result = new LicenseData();

	Object.keys( data ).forEach( ( licenseType ) =>
	{
		const array = data[ licenseType ];
		for( const fPackIndex in array )
		{
			const fPackage = array[ fPackIndex ];

			const name = fPackage.name.slice( fPackage.name.startsWith( "@" ) ? 1 : 0 );
			const authors = fPackage.author;
			const homepage = fPackage.homepage;

			for( const i in fPackage.versions )
			{
				const origLicense = fPackage.license;
				let license = GetLicenceFile( fPackage.paths[ i ] );
				const noticeFile = GetNoticeFile( fPackage.paths[ i ] );

				let licenseType = LicenseDataType.Text;

				if( !license )
				{
					license = origLicense;
					licenseType = LicenseDataType.Expression;

					if( ValidationHelper.IsUrl( origLicense ) )
					{
						licenseType = LicenseDataType.Url;
					}
				}

				const licensePackage = new LicensePackage( licenseType, name, fPackage.versions[ i ], authors, undefined, homepage, license, noticeFile, undefined );
				result.Packages.push( licensePackage );
			}
		}
	} );

	// Sort by Name
	result.Packages.sort( ( left, right ) =>
	{
		return left.Name < right.Name ? -1 : left.Name > right.Name ? 1 : 0;
	} );

	return result;
}
