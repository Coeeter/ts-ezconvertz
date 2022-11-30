import { Button, Center, Heading, VStack } from '@chakra-ui/react';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

export default function Completion() {
  const navigate = useNavigate();

  return (
    <Center w="100%" h="100vh" p={5}>
      <VStack gap={5} maxW="lg">
        <CheckIcon
          sx={{
            fontSize: '15vw',
            border: '2px',
            borderRadius: '50%',
            color: 'aquamarine',
          }}
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
