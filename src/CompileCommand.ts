import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { FormatJson } from "./JsonWritter";
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

			if( options.JsonFile )
			{
				FormatJson( options.JsonFile, data );
			}

			if( options.MdFile )
			{
				WriteOutputMD( options.MdFile, data );
			}
		}
	} );
}

export function GetLicenceFile( packagePath: string )
{
	const licenseFileNames = [ "LICENSE", "LICENCE", "COPYING" ];
	let licenseFileContent;

	for( const i in licenseFileNames )
	{
		const regex = new RegExp( `${ licenseFileNames[ i ] }.*?`, "i" );
		fs.readdirSync( packagePath ).some( ( file ) =>
		{
			const match = file.match( regex );
			if( match )
			{
				// Log.Dbg( "L: ", path.join( packagePath, file ) );
				licenseFileContent = fs.readFileSync( path.join( packagePath, file ) ).toString();
			}

			return match;
		} );

		if( licenseFileContent )
		{
			break;
		}
	}

	/*
	 if( !licenseFileContent )
	 {
	 	Log.Err( `FILE NOT FOUND: ${ packagePath }` );
	 }
	 */

	return licenseFileContent;
}
