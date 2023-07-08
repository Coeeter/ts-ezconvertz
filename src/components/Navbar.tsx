import { Box, Heading, HStack, Image, Link } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Box
      w="100%"
      bg={'whiteAlpha.200'}
      p={5}
      as={HStack}
      justifyContent="space-between"
    >
      <HStack
        cursor="pointer"
        as={Link}
        href="/"
        _hover={{ textDecoration: 'none' }}
      >
        <Image src="/ezconvertz-logo.svg" w="3rem" />
        <Heading size="md">EZConvertz</Heading>
      </HStack>
      <HStack spacing={4} alignItems="center">
        <Link
          href="/privacy-policy"
          color={'white'}
          _hover={{ color: 'red.500' }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms-of-use"
          color={'white'}
          _hover={{ color: 'red.500' }}
        >
          Terms of Use
        </Link>
      </HStack>
    </Box>
  );
}
