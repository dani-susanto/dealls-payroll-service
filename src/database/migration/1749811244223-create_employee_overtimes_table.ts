import { MigrationInterface, QueryRunner, Table, TableCheck, TableForeignKey } from "typeorm";

export class CreateEmployeeOvertimesTable1749811244223 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "employee_overtimes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "employee_id",
                        type: "uuid",
                    },
                    {
                        name: "overtime_date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "extra_hour",
                        type: "integer",
                    },
                    {
                        name: "created_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createCheckConstraint(
            "employee_overtimes",
            new TableCheck({
                name: "CHK_employee_overtimes_extra_hour",
                expression: `"extra_hour" > 0 AND "extra_hour" <= 3`
            })
        );
        await queryRunner.createForeignKey(
            "employee_overtimes",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "employees",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("employee_overtimes");
    }
}
