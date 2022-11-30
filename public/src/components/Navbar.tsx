import { useNavigate } from 'react-router-dom';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  useColorMode,
} from '@chakra-ui/react';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <Box
      w="100%"
      bg={colorMode == 'dark' ? 'whiteAlpha.200' : 'gray.200'}
      p={5}
      as={HStack}
      justifyContent="space-between"
    >
      <HStack cursor="pointer" onClick={() => navigate('/')}>
        <Image src="ezconvertz-logo.svg" w="3rem" />
        <Heading size="md">EZConvertz</Heading>
      </HStack>
      <IconButton
        aria-label="Toggle dark and light mode"
        size="lg"
        onClick={toggleColorMode}
      >
        {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Box>
  );
}
