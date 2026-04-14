export enum LicenseDataType
{
	// Enum error
	EnumNullError = 0,

	// License error
	Error = 1,

	// Plain text
	Text = 2,

	// Short expression
	Expression = 3,

	// Web url
	Url = 4,
}

export interface ILicensePackage
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
}

export interface ILicenseData
{
	ProjectLicense?: string;
	Packages: ILicensePackage[];
}

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
