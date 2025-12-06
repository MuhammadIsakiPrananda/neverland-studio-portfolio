'use strict';

export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  
  // Dummy user untuk testing
  return await queryInterface.bulkInsert('Users', [{
    name: 'Admin User',
    username: 'admin',
    email: 'admin@neverland.local',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye8Yp5.JGuwEhpZWrDz2RqY0z.Ov0qbD2', // 'password' (bcrypt hashed)
    provider: 'email',
    role: 'admin',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    name: 'Test User',
    username: 'testuser',
    email: 'test@neverland.local',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMye8Yp5.JGuwEhpZWrDz2RqY0z.Ov0qbD2', // 'password' (bcrypt hashed)
    provider: 'email',
    role: 'user',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {});
}

export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  return await queryInterface.bulkDelete('Users', null, {});
}
