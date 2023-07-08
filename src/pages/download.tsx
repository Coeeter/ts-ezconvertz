import { Button, Center, Heading, VStack, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useService } from '../context/VideoServiceContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SeoHead from '@/components/SeoHead';

export default function Download() {
  const service = useService();
  const path = useRouter().query.p as string;

  useEffect(() => {
    if (!path) return;
    window.location.assign(service?.getDownloadUrl(path)!);
  }, [path]);

  return (
    <>
      <SeoHead
        title="EZConvertz | Download"
        description="Easily convert multiple youtube videos to mp3 files in one go."
      />
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
              as={Link}
              href="/convert"
              _hover={{ bg: 'red.600' }}
              _active={{ bg: 'red.700' }}
            >
              Convert more
            </Button>
          </VStack>
        </Center>
      </VStack>
    </>
  );
}
