import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRequestLogsTable1749997050304 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "request_logs",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    isGenerated: true
                },
                {
                    name: "request_id",
                    type: "uuid",
                    isUnique: true,
                    isNullable: true
                },
                {
                    name: "method",
                    type: "varchar",
                    length: "10",
                    isNullable: false
                },
                {
                    name: "path",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "ip_address",
                    type: "varchar",
                    length: "45",
                    isNullable: true
                },
                {
                    name: "user_agent",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "request_body",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: true
                },
                {
                    name: "response_code",
                    type: "integer",
                    isNullable: true
                },
                {
                    name: "response_body",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "error_message",
                    type: "text",
                    isNullable: true
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
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("request_logs");
    }
}
