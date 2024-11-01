#!/bin/bash

# Color codes for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to validate project name
validate_project_name() {
    if [[ ! $1 =~ ^[a-z0-9-]+$ ]]; then
        return 1
    fi
    return 0
}

# Function to validate and create directory if needed
validate_directory() {
    local dir=$1
    
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}Directory doesn't exist. Create it? (y/n)${NC}"
        read create_dir
        if [[ $create_dir =~ ^[Yy]$ ]]; then
            mkdir -p "$dir"
            if [ $? -ne 0 ]; then
                echo -e "${RED}Failed to create directory. Please check permissions and path.${NC}"
                return 1
            fi
        else
            return 1
        fi
    fi
    
    if [ ! -w "$dir" ]; then
        echo -e "${RED}Directory is not writable. Please check permissions.${NC}"
        return 1
    fi
    
    return 0
}

# Welcome message
echo -e "${BLUE}🚀 AI Assistant Project Setup${NC}"

# Project name input with validation
while true; do
    echo -e "${YELLOW}Please enter a project name (lowercase letters, numbers, and hyphens only):${NC}"
    read project_name
    
    if validate_project_name "$project_name"; then
        break
    else
        echo -e "${YELLOW}Invalid project name. Please use only lowercase letters, numbers, and hyphens.${NC}"
    fi
done

# Project location input with default as current directory
current_dir=$(pwd)
echo -e "${YELLOW}Enter project location (press Enter for current directory: $current_dir):${NC}"
read project_location

if [ -z "$project_location" ]; then
    project_location="$current_dir"
else
    project_location="${project_location/#\~/$HOME}"
    project_location=$(realpath -m "$project_location")
fi

if ! validate_directory "$project_location"; then
    echo -e "${RED}Invalid directory. Exiting...${NC}"
    exit 1
fi

echo -e "${BLUE}Setting up project: $project_name${NC}"
echo -e "${BLUE}Location: $project_location${NC}"

# Navigate to project location
cd "$project_location"

# Create project using Vite
echo -e "${GREEN}Creating new Vite project with React and TypeScript...${NC}"
npm create vite@latest "$project_name" -- --template react-ts

# Navigate into project directory
cd "$project_name"

# Install core dependencies
echo -e "${GREEN}Installing core dependencies...${NC}"
npm install

# Install essential packages
echo -e "${GREEN}Installing essential packages...${NC}"
npm install react-router-dom lucide-react @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
echo -e "${GREEN}Initializing Tailwind CSS...${NC}"
npx tailwindcss init -p

# Create basic project structure
echo -e "${GREEN}Creating basic project structure...${NC}"
mkdir -p src/{components,layouts,pages,hooks,services,store,utils,types}

# Final output with absolute path
final_project_path="$project_location/$project_name"
echo -e "${BLUE}✅ Setup complete!${NC}"
echo -e "${BLUE}Project created at: $final_project_path${NC}"
echo -e "${BLUE}To get started:${NC}"
echo -e "1. cd $final_project_path"
echo -e "2. npm run dev"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Configure Tailwind CSS"
echo -e "2. Set up React Router"
echo -e "3. Create your layout components"
echo -e "4. Start building your features"