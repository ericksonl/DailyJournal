import sys
import matplotlib.pyplot as plt

# Get the array of numbers from command-line arguments
num_array = list(map(int, sys.argv[1:]))

# Generate the graph
x = range(1, len(num_array) + 1)
plt.plot(x, num_array)
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Mood Tracker')
plt.grid(True)


file_name = 'graph.png'
save_directory = 'helperFunctions/graphImages/'
save_path = save_directory + file_name
plt.savefig(save_path)

# Print a success message
# print(f'Successfully created and saved the graph as {save_path}')