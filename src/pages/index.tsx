import SeoHead from '@/components/SeoHead';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { CSSProperties } from 'react';

export default function Landing() {
  return (
    <>
      <SeoHead
        title="EZConvertz"
        description="Easily convert multiple youtube videos to mp3 files in one go."
      />
      <Box w="100%" h="100vh" p={5} overflow="hidden">
        <Center h="100%">
          <VStack gap={5}>
            <Image
              src="/ezconvertz-logo.svg"
              boxSize={{ md: 'xs', sm: '50%' }}
              className="slide-in"
            />
            <VStack
              className="slide-in"
              style={{ '--animation-order': 1 } as CSSProperties}
            >
              <Heading size={{ sm: '4xl', base: '2xl' }}>EZConvertz</Heading>
              <Heading size={{ sm: 'lg', base: 'sm' }}>
                The Best Youtube To MP3 Converter
              </Heading>
            </VStack>
            <HStack
              w="100%"
              className="slide-in"
              style={{ '--animation-order': 2 } as CSSProperties}
            >
              <Button
                w="100%"
                as={Link}
                href="/convert"
                bg="red.500"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                Start converting now
              </Button>
            </HStack>
          </VStack>
        </Center>
      </Box>
    </>
  );
}
