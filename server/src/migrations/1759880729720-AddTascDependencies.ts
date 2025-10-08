import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTascDependencies1759880729720 implements MigrationInterface {
    name = 'AddTascDependencies1759880729720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_c616cf47714e0ab32a473ef5f0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c616cf47714e0ab32a473ef5f0"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" RENAME COLUMN "taskid" TO "taskId"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" RENAME CONSTRAINT "PK_d8fd2089a5221a259bc0c0d15e1" TO "PK_48f4d0210d39101ef722b2c019d"`);
        await queryRunner.query(`CREATE INDEX "IDX_70371fdc2193845ef4feb9fb87" ON "task_dependencies" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_70371fdc2193845ef4feb9fb879" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_70371fdc2193845ef4feb9fb879"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70371fdc2193845ef4feb9fb87"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" RENAME CONSTRAINT "PK_48f4d0210d39101ef722b2c019d" TO "PK_d8fd2089a5221a259bc0c0d15e1"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" RENAME COLUMN "taskId" TO "taskid"`);
        await queryRunner.query(`CREATE INDEX "IDX_c616cf47714e0ab32a473ef5f0" ON "task_dependencies" ("taskid") `);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_c616cf47714e0ab32a473ef5f0a" FOREIGN KEY ("taskid") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
