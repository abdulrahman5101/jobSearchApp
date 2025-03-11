import cron from 'node-cron';
import { User } from '../../db/models/user.model.js';

 const cronJob=cron.schedule('0 */6 * * *', async () => {
  try {
    const currentDate = new Date();

 
    await User.updateMany(
      { "OTP.expiresIn": { $lt: currentDate } },
      { $pull: { OTP: { expiresIn: { $lt: currentDate } } } }
    );

    console.log('Expired OTPs deleted successfully.');
  } catch (error) {
    console.error('Error deleting expired OTPs:', error);
  }
});
