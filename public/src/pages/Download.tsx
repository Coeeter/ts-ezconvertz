import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, Center, Heading, VStack, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useService } from '../context/VideoServiceContext';
import Navbar from '../components/Navbar';

export default function Download() {
  const service = useService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const path = searchParams.get('p');

  useEffect(() => {
    if (!path) return;
    window.location.assign(service?.getDownloadUrl(path)!);
  }, [path]);

  return (
    <VStack h="100vh">
      <Navbar />
      <Center p={5} flex={1}>
        <VStack gap={5} maxW="lg">
          <Image
            src="/done.svg"
            boxSize="15vw"
            minW={'200px'}
            minH={'200px'}
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
    </VStack>
  );
}
