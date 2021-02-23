import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCreate1613997622155 implements MigrationInterface {
  name = 'InitialCreate1613997622155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "jobs_status_enum" AS ENUM('Pending', 'In-Progress', 'Completed', 'Failed')`);
    await queryRunner.query(
      `CREATE TABLE "jobs" ("job_id" uuid NOT NULL, "path" text NOT NULL, "metadata" text NOT NULL, "status" "jobs_status_enum" NOT NULL DEFAULT 'In-Progress', "created" TIMESTAMP NOT NULL DEFAULT '"2021-02-22T12:40:23.655Z"', "updated" TIMESTAMP NOT NULL DEFAULT '"2021-02-22T12:40:23.655Z"', CONSTRAINT "PK_75f2e130e4b1372fea0b6248a17" PRIMARY KEY ("job_id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TYPE "jobs_status_enum"`);
  }
}
