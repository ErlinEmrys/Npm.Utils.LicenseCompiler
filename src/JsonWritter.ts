import fs from "node:fs";
import { GetLicenceFile } from "./CompileCommand";

export function FormatJson( outputFilePath: string, data: any )
{
	const packages: { Name: any; Version: any; Authors: any; Homepage: any; LicenseType: any; LicenseOriginal: undefined }[] = [];
	const result = { Packages: packages };
	Object.keys( data ).forEach( ( licenseType ) =>
	{
		const array = data[ licenseType ];
		for( const fPackIndex in array )
		{
			const fPackage = array[ fPackIndex ];
			for( const i in fPackage.versions )
			{
				const packInfo = {
					Name: fPackage.name.slice( fPackage.name.startsWith( "@" ) ? 1 : 0 ),
					Version: fPackage.versions[ i ],
					Authors: fPackage.author,
					Homepage: fPackage.homepage,
					LicenseType: fPackage.license,
					LicenseOriginal: GetLicenceFile( fPackage.paths[ i ] ),
				};
				packages.push( packInfo );
			}
		}
	} );

	// Sort by Name
	packages.sort( ( left, right ) =>
	{
		return left.Name < right.Name ? -1 : left.Name > right.Name ? 1 : 0;
	} );

	let fileContent = JSON.stringify( result, null, "\t" );
	fileContent += "\n";

	fs.writeFileSync( outputFilePath, fileContent, "utf-8" );
}
