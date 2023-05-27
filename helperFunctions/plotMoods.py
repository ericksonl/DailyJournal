import sys
import matplotlib.pyplot as plt

# Get the array of numbers from command-line arguments
args = sys.argv[1:]

num_array = sys.argv[1].split(',')

print(num_array)

for i in range(0, len(num_array)):
    num_array[i] = int(num_array[i])

labels = sys.argv[2].split(',')
user = args[2]
userName = args[3]


# Generate the graph
x = range(1, len(num_array) + 1)
plt.plot(x, num_array, color='blue', linestyle='-', linewidth=3, marker='o', markersize=8)
plt.xlabel('X')
plt.ylabel('Y')
plt.title(userName + "'s Mood Plot")

plt.xticks(x, labels)

plt.ylim(1,5)
plt.yticks(range(1, 6, 1))

plt.grid(True)

file_name = user + 'graph.png'

save_directory = 'helperFunctions/graphImages/'
save_path = save_directory + file_name

plt.savefig(save_path)

sys.exit(0)