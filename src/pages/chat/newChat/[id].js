import ChatLayout from '@/components/layouts/ChatLayout';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/router';

const NewChat = () => {
  const router = useRouter();
  const handleNewChat = async () => {
    try {
      const {
        data: { data },
      } = await axios.post('/api/contact', { target: router.query.id });
      router.push(`/chat/${data.id}`);
    } catch (error) {
      console.error({ error });
    }
  };
  return (
    <ChatLayout className="w-full h-full flex justify-center items-center">
      <Button onClick={handleNewChat}>Start Chat</Button>
    </ChatLayout>
  );
};

export default NewChat;
