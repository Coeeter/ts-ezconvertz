import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CloseButton,
  HStack,
  Spinner,
  VStack,
} from '@chakra-ui/react';

import FormItem from '../components/FormItem';
import Navbar from '../components/Navbar';
import { useService } from '../context/VideoServiceContext';

export type FormValues = {
  videos: {
    name: string;
    videoId: string;
    start: string;
    end: string;
  }[];
};

export default function Home() {
  const service = useService();
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFieldSize, setCurrentFieldSize] = useState(1);
  const { control, setValue, handleSubmit } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    name: 'videos',
    control,
  });

  const onSubmit = async ({ videos }: FormValues) => {
    setIsLoading(true);
    const filtered = videos.filter(vid => vid.videoId.length != 0);
    if (filtered.length == 0) return setIsLoading(false);
    const blob = await service?.downloadFromLinks(
      filtered.map(vid => ({
        ...vid,
        start: service?.transformTimeStringToSeconds(vid.start),
        end: service?.transformTimeStringToSeconds(vid.end),
      }))
    )!;
    setIsLoading(false);
    setIsFinished(true);
    fields.forEach((item, index) => remove(index));
    const file = window.URL.createObjectURL(blob);
    window.location.assign(file);
  };

  useEffect(() => {
    if (fields.length != 0) return;
    append({ name: '', videoId: '', start: '00:00:00', end: '00:00:00' });
  }, []);

  useEffect(() => {
    if (isFinished) navigate('/convert/completion');
  }, [isFinished]);

  useEffect(() => {
    if (fields.length > currentFieldSize) {
      setCurrentFieldSize(prev => {
        return prev + 1;
      });
      return window.scrollTo({
        top: document.body.clientHeight,
        behavior: 'smooth',
      });
    }
    setCurrentFieldSize(prev => {
      return prev - 1;
    });
  }, [fields]);

  return (
    <VStack minH="100vh">
      <Navbar />
      {isFinished ? (
        <Outlet />
      ) : (
        <Box w="100%" p={10} display="flex" justifyContent="center">
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w={{ base: 'md', lg: 'lg', xl: 'xl' }}
            gap={3}
          >
            {fields.map((field, index) => (
              <Box w="100%" position="relative" overflow="hidden">
                <FormItem
                  key={field.id}
                  index={index}
                  control={control}
                  setValue={setValue}
                />
                {index != 0 ? (
                  <CloseButton
                    position="absolute"
                    top={5}
                    right={5}
                    onClick={() => remove(index)}
                  />
                ) : null}
              </Box>
            ))}
            <HStack w="100%" gap={3}>
              <Button
                w="50%"
                isDisabled={isLoading}
                onClick={() => {
                  append({ name: '', videoId: '', end: '', start: '' });
                }}
              >
                Add Video
              </Button>
              <Button
                w="50%"
                isDisabled={isLoading}
                type="submit"
                bg="red.500"
                _hover={{ bg: 'red.600' }}
                _active={{ bg: 'red.700' }}
              >
                {!isLoading ? 'Start converting' : <Spinner />}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
