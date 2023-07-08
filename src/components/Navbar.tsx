import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  useColorMode,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      w="100%"
      bg={colorMode == 'dark' ? 'whiteAlpha.200' : 'red.200'}
      p={5}
      as={HStack}
      justifyContent="space-between"
    >
      <HStack cursor="pointer" as={Link} href="/">
        <Image src="/ezconvertz-logo.svg" w="3rem" />
        <Heading size="md">EZConvertz</Heading>
      </HStack>
      <IconButton
        aria-label="Toggle dark and light mode"
        size="lg"
        colorScheme={colorMode == 'dark' ? 'gray' : 'red'}
        onClick={toggleColorMode}
      >
        {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Box>
  );
}
