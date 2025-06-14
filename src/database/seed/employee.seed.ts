import { Employee } from '../../entities/employee.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class EmployeeSeeder implements Seeder {
    /**
     * Track seeder execution.
     *
     * Default: false
     */
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const employeeFactory = await factoryManager.get(Employee);
        await employeeFactory.saveMany(100);
    }
}