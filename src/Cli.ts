import type { ICompileOptions } from "./CompileCommand";
import process from "node:process";
import { ConsoleLogger } from "@erlinemrys/lib.common";
import { Command } from "commander";
import { version } from "./../package.json";
import { CompileCommand } from "./CompileCommand";

Log.Subscribe( new ConsoleLogger() );
Log.Dbg( "Program START" );

const program = new Command();

program
	.name( "license-compile" )
	.description( "CLI to Utility for managing licenses" )
	.version( version );

program.command( "Compile", { isDefault: true } )
	.description( "Gather all third parties licenses, compiles it together and write it as MD or JSON file." )
	.option( "-s, --Source <SF>", "Specify a path to package.json source file" )
	.option( "-m, --Md-file <MDFile>", "Specify a path to output MD file" )
	.option( "-j, --Json-file <JsonFile>", "Specify a path to output JSON file" )
	.action( async( options: ICompileOptions ) =>
	{
		await CompileCommand( options );
	} );

export async function Main( args: string[] ): Promise<void>
{
	await program.parseAsync( args );
}

Main( process.argv ).catch( reason => Log.Err( "FATAL ERROR", reason ) );

Log.Dbg( "Program END" );
