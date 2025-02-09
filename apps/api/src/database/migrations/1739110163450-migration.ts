import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739110163450 implements MigrationInterface {
    name = 'Migration1739110163450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "description" character varying NOT NULL, "merchantId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_7139c20741319eaa68e7fac20ed" FOREIGN KEY ("merchantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_7139c20741319eaa68e7fac20ed"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
