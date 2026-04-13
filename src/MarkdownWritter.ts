import type { ILicenseData } from "./License";
import fs from "node:fs";
import { ValidationHelper } from "@erlinemrys/lib.common";
import { LicenseDataType } from "./License";

const MD_HEADER_FIRST_SEPARATOR = "=";
const MD_HEADER_SECOND_SEPARATOR = "-";
const MD_LINE_ENDING = "\n";
const MD_SPDX_URL = "https://spdx.org/licenses/";

export function WriteOutputMD( outputFilePath: string, data: ILicenseData )
{
	let result = "";
	result = WriteHeaderMD( result, "Third party licenses", MD_HEADER_FIRST_SEPARATOR );
	result = WriteParagraphMD( result, "*This software stands on the shoulders of the following giants:*" );
	result = WriteLineMD( result );

	data.Packages.forEach( ( fPackage ) =>
	{
		result = WriteHeaderMD( result, `${ fPackage.Name } [${ fPackage.Version }]`, MD_HEADER_SECOND_SEPARATOR, 1 );

		if( fPackage.Homepage )
		{
			result = WriteParagraphMD( result, `Homepage: <${ fPackage.Homepage }>`, 1 );
		}

		if( fPackage.Authors )
		{
			result = WriteParagraphMD( result, `Authors: ${ fPackage.Authors }`, 1 );
		}

		result = WriteLineMD( result, "License:", 1 );

		if( fPackage.LicenseDataType === LicenseDataType.Text )
		{
			result = WriteComplexMD( result, fPackage.License, 2 );
		}
		else if( fPackage.LicenseDataType === LicenseDataType.Url )
		{
			result = WriteLineMD( result, `<${ fPackage.License }>`, 2 );
		}
		else if( fPackage.LicenseDataType === LicenseDataType.Expression )
		{
			const url = `${ MD_SPDX_URL }${ fPackage.License }.html`;
			if( ValidationHelper.IsUrl( url ) )
			{
				result = WriteLineMD( result, `[${ fPackage.License }](${ url })`, 2 );
			}
			else
			{
				result = WriteLineMD( result, fPackage.License, 2 );
			}
		}
		else
		{
			result = WriteLineMD( result, "Error in retrieval of license", 2 );
		}

		result = WriteLineMD( result, undefined, 1 );
		result = WriteLineMD( result );
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

function WriteComplexMD( result: string, text: string | undefined, indentation = 0 )
{
	if( text )
	{
		const lines = text.split( /\r?\n/ );
		lines.forEach( line => result = WriteLineMD( result, line, indentation ) );
	}

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
