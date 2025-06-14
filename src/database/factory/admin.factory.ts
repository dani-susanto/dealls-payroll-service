import { setSeederFactory } from 'typeorm-extension';
import { hash } from 'bcrypt';
import { Admin } from '../../entities/admin.entity';

export default setSeederFactory(Admin, async (faker) => {
    const admin = new Admin();
    admin.name = 'dealls Payroll Admin';
    admin.username = 'dealls_admin';
    admin.password = await hash(`${admin.username}123+`, 10);
    return admin;
});
