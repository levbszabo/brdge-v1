# Contributing to DotBridge

We welcome contributions to the DotBridge Research Framework! This guide will help you get started.

## 🎯 Our Focus

DotBridge is evolving from a sophisticated research system to an accessible open-source framework. Our current priority is **simplification while maintaining power** - making the system easier to use without losing its advanced capabilities.

## 🚀 Ways to Contribute

### Priority Areas

1. **Simplification** 
   - Reduce complexity while maintaining functionality
   - Create lightweight modes for common use cases
   - Improve error messages and user guidance

2. **Documentation**
   - Clearer setup guides and tutorials
   - Industry-specific usage examples
   - Video walkthroughs of key features

3. **Performance**
   - Optimization of knowledge extraction pipeline
   - Faster processing for common content types
   - Memory efficiency improvements

4. **Testing & Reliability**
   - Unit tests for core components
   - Integration tests for full workflows
   - Error handling improvements

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git fork https://github.com/levbszabo/dotbridge
   git clone https://github.com/yourusername/dotbridge.git
   cd dotbridge
   ```

2. **Set Up Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

3. **Configure**
   ```bash
   cp config.txt backend/.env
   # Add your GOOGLE_API_KEY to backend/.env
   ```

4. **Test Your Setup**
   ```bash
   python quickstart_extraction.py --video /path/to/test/video.mp4
   ```

## 📝 Contribution Process

1. **Create an Issue** - Discuss your idea before implementing
2. **Create a Branch** - Use descriptive names like `feature/lightweight-extraction` or `fix/setup-documentation`
3. **Make Your Changes** - Follow our coding standards
4. **Test Thoroughly** - Ensure your changes work with different content types
5. **Submit a Pull Request** - Include a clear description of what you've changed

## 🧪 Testing

### Manual Testing
```bash
# Test knowledge extraction
python quickstart_extraction.py --video test_video.mp4 --type course

# Test agent system  
python quickstart_agent.py --demo

# Test with different content types
python quickstart_extraction.py --video sales_demo.mp4 --type vsl
```

### Automated Testing (Coming Soon)
We're working on comprehensive test suites. Contributions to testing infrastructure are especially welcome!

## 📋 Coding Standards

### Python
- Follow PEP 8 style guidelines
- Use type hints where helpful
- Add docstrings for new functions
- Keep functions focused and modular

### Documentation
- Update README.md if you change core functionality
- Add examples for new features
- Keep language clear and concise

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Your environment (OS, Python version, etc.)
- Error messages or logs
- Sample content that triggers the issue (if possible)

## 💡 Feature Requests

We're especially interested in:
- **Simplification ideas** - How can we make this easier to use?
- **Performance improvements** - Faster processing, lower memory usage
- **New content types** - Additional domains or use cases
- **Integration opportunities** - How should this work with other tools?

## 🎨 UI/UX Contributions

The frontend is built with React and Material-UI. We welcome:
- Improved user experience for setup and configuration
- Better visualization of knowledge graphs
- Mobile-responsive design improvements
- Accessibility enhancements

## 📚 Documentation Contributions

Help make DotBridge more accessible:
- **Setup guides** for specific platforms or use cases
- **Tutorial videos** showing key features
- **Industry examples** for finance, research, education
- **Translation** to other languages

## 🏆 Recognition

Contributors will be:
- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes for significant contributions
- Invited to join our developer community

## ❓ Questions?

- **General questions**: Create a GitHub Discussion
- **Bug reports**: Create a GitHub Issue
- **Feature requests**: Create a GitHub Issue with the "enhancement" label
- **Security issues**: Email [security@journeymanai.io](mailto:security@journeymanai.io)

## 📄 License

By contributing to DotBridge, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for helping make DotBridge better! 🚀 