import prisma from '@/lib/prisma';
import AuthMiddleware from '@/middlewares/AuthMiddelware';

function handler(req, res, session) {
  switch (req.method) {
    case 'GET':
      handlerGet(req, res, session);
      break;
    case 'POST':
      handlerPost(req, res, session);
      break;
  }
}

const handlerGet = async (req, res, session) => {
  try {
    const { user } = session;
    const userId = Number(user.id);
    const getRoom = await prisma.room.findMany({
      where: {
        userRoom: {
          some: {
            userId,
          },
        },
      },
      include: {
        userRoom: {
          where: {
            userId: {
              not: userId,
            },
          },
        },
      },
    });

    const idHaveChats = getRoom.map(({ userRoom }) => {
      return { id: userRoom[0].userId, roomId: userRoom[0].roomId };
    });

    const getUser = await prisma.user.findMany({
      select: {
        password: false,
        name: true,
        id: true,
      },
    });

    const contacs = getUser.map(({ name, id }) => {
      const chat = idHaveChats.find((x) => x.id == id);
      return {
        name,
        id,
        chat: chat || false,
      };
    });

    return res.status(200).json({ message: 'success', data: contacs });
  } catch (error) {
    res.status(500).json({ message: 'Internal serverl error', error });
  }
};

const handlerPost = async (req, res, session) => {
  try {
    const { user } = session;
    const userId = Number(user.id);
    const { target } = req.body;
    const targetId = Number(target);

    const room = await prisma.room.create({
      data: {
        userRoom: {
          create: [{ userId: userId }, { userId: targetId }],
        },
      },
      include: {
        userRoom: true,
      },
    });
    return res.status(200).json({ message: 'success', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal serverl error', error });
  }
};

export default AuthMiddleware(handler);
