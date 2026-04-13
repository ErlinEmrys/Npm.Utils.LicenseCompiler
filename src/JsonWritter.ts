import type { ILicenseData } from "./License";
import fs from "node:fs";

export function FormatJson( outputFilePath: string, data: ILicenseData )
{
	let fileContent = JSON.stringify( data, null, "\t" );
	fileContent += "\n";

	fs.writeFileSync( outputFilePath, fileContent, "utf-8" );
}
