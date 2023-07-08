import Navbar from '@/components/Navbar';
import SeoHead from '@/components/SeoHead';
import { useService } from '@/context/VideoServiceContext';
import Status from '@/models/Status';
import {
  Button,
  Center,
  Heading,
  Image,
  VStack,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Download() {
  const service = useService();
  const router = useRouter();
  const toast = useToast();
  const { session } = router.query;
  const [status, setStatus] = useState<Status>('processing');

  useEffect(() => {
    if (!session || typeof session != 'string') return;
    let timeout: NodeJS.Timeout;
    const fetchStatus = async () => {
      const status = await service?.getConversionStatus(session);
      setStatus(status!);
      if (status == 'processing' || status == 'pending') {
        timeout = setTimeout(fetchStatus, 1000);
        return;
      }
      if (status == 'error') {
        toast({
          title: 'Error',
          description: 'There was an error converting the videos',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if (status != 'done') return;
      window.location.assign(service?.getDownloadUrl(session)!);
    };
    fetchStatus();
    return () => clearTimeout(timeout);
  }, [session]);

  return (
    <>
      <SeoHead
        title="EZConvertz | Download"
        description="Easily convert multiple youtube videos to mp3 files in one go."
      />
      <VStack h="100vh">
        <Navbar />
        <Center p={5} flex={1}>
          {status == 'done' ? (
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
                as={Link}
                href="/convert"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                Convert more
              </Button>
            </VStack>
          ) : (
            <VStack gap={5} maxW="lg">
              <Image
                src="/processing.svg"
                boxSize="15vw"
                minW={'200px'}
                minH={'200px'}
              />
              <Heading size="lg" textAlign="center">
                Converting and downloading the videos in mp3 format
              </Heading>
            </VStack>
          )}
        </Center>
      </VStack>
    </>
  );
}
