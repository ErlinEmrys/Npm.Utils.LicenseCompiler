import fs from "node:fs";
import { GetLicenceFile } from "./CompileCommand";

const MD_HEADER_FIRST_SEPARATOR = "=";
const MD_HEADER_SECOND_SEPARATOR = "-";
const MD_LINE_ENDING = "\n";

export function WriteOutputMD( outputFilePath: string, data: any )
{
	let result = "";
	result = WriteHeaderMD( result, "Third party licenses", MD_HEADER_FIRST_SEPARATOR );
	result = WriteParagraphMD( result, "*This software stands on the shoulders of the following giants:*" );
	result = WriteLineMD( result );

	Object.keys( data ).forEach( ( licenseType ) =>
	{
		const array = data[ licenseType ];
		for( const fPackIndex in array )
		{
			const fPackage = array[ fPackIndex ];
			for( const i in fPackage.versions )
			{
				result = WriteHeaderMD( result, `${ fPackage.name.slice( fPackage.name.startsWith( "@" ) ? 1 : 0 ) } [${ fPackage.versions[ i ] }]`, MD_HEADER_SECOND_SEPARATOR, 1 );

				if( fPackage.homepage )
				{
					result = WriteParagraphMD( result, `Homepage: <${ fPackage.homepage }>`, 1 );
				}

				if( fPackage.author )
				{
					result = WriteParagraphMD( result, `Authors: ${ fPackage.author }`, 1 );
				}

				result = WriteLineMD( result, "License:", 1 );

				const licenseFile = GetLicenceFile( fPackage.paths[ i ] );
				if( licenseFile )
				{
					result = WriteComplexMD( result, licenseFile, 2 );
				}
				else
				{
					let url = fPackage.license;
					if( IsUrl( url ) )
					{
						result = WriteLineMD( result, `<${ url }>`, 2 );
					}
					else
					{
						url = `https://spdx.org/licenses/${ url }.html`;
						if( IsUrl( url ) )
						{
							result = WriteLineMD( result, `[${ fPackage.license }](${ url })`, 2 );
						}
						else
						{
							result = WriteLineMD( result, fPackage.license, 2 );
						}
					}
				}

				result = WriteLineMD( result, undefined, 1 );
				result = WriteLineMD( result );
			}
		}
	} );

	fs.writeFileSync( outputFilePath, result, "utf-8" );
}

function WriteHeaderMD( result: string, text: string, headerSeparator: string, indentation = 0 )
{
	result = WriteLineMD( result, text, indentation );
	result = WriteLineMD( result, headerSeparator.repeat( text.length ), indentation );
	result = WriteLineMD( result, undefined, indentation );

	return result;
}

function WriteComplexMD( result: string, text: string, indentation = 0 )
{
	const lines = text.split( /\r?\n/ );
	lines.forEach( line => result = WriteLineMD( result, line, indentation ) );

	return result;
}

function WriteParagraphMD( result: string, text: string, indentation = 0 )
{
	result = WriteLineMD( result, text, indentation );
	result = WriteLineMD( result, undefined, indentation );

	return result;
}

function WriteLineMD( result: string, text: string | undefined = undefined, indentation = 0 )
{
	result = WriteIndentationMD( result, text, indentation );
	if( text )
	{
		result += text;
	}
	result += MD_LINE_ENDING;

	return result;
}

function WriteIndentationMD( result: string, text: string | undefined, indentation: number )
{
	if( indentation > 0 )
	{
		result += ">".repeat( indentation );
		if( text )
		{
			result += " ";
		}
	}

	return result;
}

function IsUrl( string: string )
{
	try
	{
		const url = new URL( string );
		return url.protocol === "http:" || url.protocol === "https:";
	}
	catch
	{
		return false;
	}
}
