import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Admin } from '../../entities/admin.entity';

export default class AdminSeeder implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const adminFactory = await factoryManager.get(Admin);
        await adminFactory.save();
    }
}
