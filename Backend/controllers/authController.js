const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Simulate sending the token to the user
    res.send({
      message: 'Password reset token generated.',
      resetToken, // Return the token for testing purposes
      note: 'Use this token in the reset password endpoint.'
    });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user by decoded ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the password
      user.passwordHash = hashedPassword;
      await user.save();
  
      res.send({ message: 'Password reset successful!' });
    } catch (err) {
      res.status(400).send({ message: 'Invalid or expired token', error: err.message });
    }
  };