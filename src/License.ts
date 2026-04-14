import type { ILicenseData, ILicensePackage, LicenseDataType } from "@erlinemrys/lib.common";

export class LicensePackage implements ILicensePackage
{
	Name: string;
	Version?: string;
	Authors?: string;
	Copyright?: string;
	Homepage?: string;
	LicenseDataType: LicenseDataType;
	License?: string;
	Notice?: string;
	RelatedPacakges?: string[];

	constructor( licenseDataType: LicenseDataType, name: string, version?: string, authors?: string, copyright?: string, homepage?: string, license?: string, notice?: string, relatedPackages?: string[] )
	{
		this.Name = name;
		this.Version = version;
		this.Authors = authors;
		this.Copyright = copyright;
		this.Homepage = homepage;
		this.LicenseDataType = licenseDataType;
		this.License = license;
		this.Notice = notice;
		this.RelatedPacakges = relatedPackages;
	}
}

export class LicenseData implements ILicenseData
{
	ProjectLicense?: string;
	Packages: ILicensePackage[] = [];
}
