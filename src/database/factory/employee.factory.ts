import { setSeederFactory } from 'typeorm-extension';
import { hash } from 'bcrypt';
import { Employee } from '../../entities/employee.entity';

export default setSeederFactory(Employee, async (faker) => {
    const employee = new Employee();
    employee.name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    employee.username = faker.internet.userName().toLowerCase();
    employee.password = await hash(`${employee.username}123+`, 10);
    employee.basic_salary_amount = faker.number.int({ min: 3000000, max: 10000000 });
    return employee;
});