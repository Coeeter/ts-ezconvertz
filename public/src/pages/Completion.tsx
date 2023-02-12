import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, Center, Heading, VStack, Image, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useService } from '../context/VideoServiceContext';

export default function Completion() {
  const service = useService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const path = searchParams.get('p');

  useEffect(() => {
    if (!path) return;
    service?.deleteFile(path);
  }, [path]);

  return (
    <Center w="100%" h="100vh" p={5}>
      <VStack gap={5} maxW="lg">
        <Image
          src="/done.svg"
          boxSize="15vw"
          borderRadius="full"
          background="aquamarine"
        />
        <Heading size="lg" textAlign="center">
          Completed converting and downloading the videos in mp3 format
        </Heading>
        <Button
          bg="red.500"
          w="80%"
          _hover={{ bg: 'red.600' }}
          _active={{ bg: 'red.700' }}
          onClick={() => navigate('/convert')}
        >
          Convert more
        </Button>
      </VStack>
    </Center>
  );
}
