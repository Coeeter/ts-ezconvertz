import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import {
  Box,
  Button,
  CloseButton,
  HStack,
  Spinner,
  useColorMode,
  VStack,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import FormItem from '../components/FormItem';
import Navbar from '../components/Navbar';
import { useService } from '../context/VideoServiceContext';
import SeoHead from '@/components/SeoHead';

export type FormValues = {
  videos: {
    name: string;
    videoId: string;
    start: string;
    end: string;
  }[];
};

export default function Convert() {
  const { colorMode } = useColorMode();
  const service = useService();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFieldSize, setCurrentFieldSize] = useState(1);
  const { control, setValue, handleSubmit } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    name: 'videos',
    control,
  });

  const btnProps =
    colorMode == 'light'
      ? {
          bg: 'red.200',
          _hover: { bg: 'red.300' },
          _active: { bg: 'red.400' },
        }
      : {};

  const onSubmit: SubmitHandler<FormValues> = async ({ videos }) => {
    setIsLoading(true);
    const filtered = videos.filter(vid => vid.videoId.length != 0);
    if (filtered.length == 0) return setIsLoading(false);
    const session = await service.convertVideos(
      filtered.map(vid => ({
        ...vid,
        start: service?.transformTimeStringToSeconds(vid.start),
        end: service?.transformTimeStringToSeconds(vid.end),
      }))
    )!;
    router.push(`/download/${session}`);
  };

  useEffect(() => {
    if (fields.length != 0) return;
    append({ name: '', videoId: '', start: '00:00:00', end: '00:00:00' });
  }, []);

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
    <>
      <SeoHead
        title="EZConvertz | Convert"
        description="Easily convert multiple youtube videos to mp3 files in one go."
      />
      <VStack minH="100vh">
        <Navbar />
        <Box
          w="100%"
          p={{ base: 5, sm: 10 }}
          display="flex"
          justifyContent="center"
        >
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w={{ base: 'md', lg: 'lg', xl: 'xl' }}
            gap={3}
          >
            {fields.map((field, index) => (
              <Box w="100%" position="relative" overflow="hidden" key={index}>
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
                key="add"
                isDisabled={isLoading}
                onClick={() => {
                  append({ name: '', videoId: '', end: '', start: '' });
                }}
                {...btnProps}
              >
                Add Video
              </Button>
              <Button
                w="50%"
                key="submit"
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
      </VStack>
    </>
  );
}
