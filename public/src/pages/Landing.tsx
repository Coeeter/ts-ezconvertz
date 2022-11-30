import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  VStack
} from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <Box w="100%" h="100vh" p={5} overflow="hidden">
      <Center h="100%">
        <VStack gap={5}>
          <Image
            src="ezconvertz-logo.svg"
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
              to="/convert"
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
  );
}
