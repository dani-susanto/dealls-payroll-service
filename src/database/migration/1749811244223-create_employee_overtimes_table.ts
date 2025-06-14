import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeOvertimesTable1749811244223 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "employee_overtimes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "employee_id" uuid,
                "overtime_date" date NOT NULL,
                "extra_hour" integer CHECK (extra_hour > 0 AND extra_hour <= 3),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee_overtimes"`);
    }
}
