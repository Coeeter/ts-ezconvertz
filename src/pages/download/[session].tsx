import Navbar from '@/components/Navbar';
import SeoHead from '@/components/SeoHead';
import { useService } from '@/context/VideoServiceContext';
import { Button, Center, Heading, Image, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Download() {
  const service = useService();
  const router = useRouter();
  const { session } = router.query;

  useEffect(() => {
    if (!session || typeof session != 'string') return;
    const download = async () => {
      const res = await fetch(service?.getDownloadUrl(session)!);
      if (!res.ok) return;
      const data = await res.blob();
      window.location.assign(URL.createObjectURL(data));
    };
    download();
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
