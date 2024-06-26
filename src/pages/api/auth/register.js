import prisma from '@/lib/prisma';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

const requestValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});

export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      handleRegister(req, res);
      break;
  }
}

const handleRegister = async (req, res) => {
  try {
    const {
      value: { name, email, password },
      error,
    } = requestValidation.validate(req.body);
    if (error) throw new Error(error);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already used');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: 'success', data: newUser });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error', error: error.message });
  }
};
