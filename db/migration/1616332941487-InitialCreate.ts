import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialCreate1616332941487 implements MigrationInterface {
    public name = 'InitialCreate1616332941487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "jobs_status_enum" AS ENUM('Pending', 'In-Progress', 'Completed', 'Failed')`);
        await queryRunner.query(
            `CREATE TABLE "jobs" (
                "job_id" uuid NOT NULL, 
                "model_path" text NOT NULL, 
                "metadata" text NOT NULL, 
                "status" "jobs_status_enum" NOT NULL DEFAULT 'Pending', 
                "created" TIMESTAMP NOT NULL DEFAULT '"2021-03-21T13:22:22.866Z"', 
                "updated" TIMESTAMP NOT NULL DEFAULT '"2021-03-21T13:22:22.866Z"', 
                CONSTRAINT "PK_75f2e130e4b1372fea0b6248a17" PRIMARY KEY ("job_id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "jobs_status_enum"`);
    }

}
