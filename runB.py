import subprocess
import os

#this script is used to run the backend server with 'npm run dev' and the client with 'npm start'
def run_command(command, cwd=None):
	process = subprocess.Popen(command, shell=True, cwd=cwd)
	return process

def main():
	backend_dir = os.path.join(os.getcwd(), "backend")
	client_dir = os.path.join(os.getcwd(), "client")

	# Run backend server
	backend_process = run_command("npm run dev", cwd=backend_dir)
	print("Backend server is running...")

	# Run client
	client_process = run_command("npm start", cwd=client_dir)
	print("Client is running...")

	try:
		backend_process.wait()
		client_process.wait()
	except KeyboardInterrupt:
		print("Shutting down...")
		backend_process.terminate()
		client_process.terminate()

if __name__ == "__main__":
	main()