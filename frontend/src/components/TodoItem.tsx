import { Box, HStack, Text, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onDelete }: TodoItemProps) => {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="start">
        <Box>
          <Text fontWeight="semibold" fontSize="lg">
            {todo.title}
          </Text>
          {todo.description && (
            <Text color="gray.600" mt={1}>
              {todo.description}
            </Text>
          )}
          <Text fontSize="sm" color="gray.500" mt={2}>
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </Text>
        </Box>
        <Button
          onClick={() => onDelete(todo.id)}
          colorScheme="red"
          variant="ghost"
          size="sm"
        >
          <DeleteIcon />
        </Button>
      </HStack>
    </Box>
  );
}; 