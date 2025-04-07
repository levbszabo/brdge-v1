import React, { useState, useRef } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    IconButton,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    GlobalStyles
} from '@mui/material';
import {
    ArrowForward,
    Add as AddIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Preview as PreviewIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import Neo-Scholar theme assets
import darkParchmentTexture from '../assets/textures/dark-parchment.png';
import lightMarbleTexture from '../assets/textures/light_marble.jpg';
import grainyMarbleTexture from '../assets/textures/grainy-marble.jpg';
import crumbledParchmentTexture from '../assets/textures/crumbled_parchment.jpg';
import oldMapTexture from '../assets/textures/old_map.jpg';
import stampLogoTexture from '../assets/brdge-stamp-logo.png';

// Animation keyframes
const spinAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

const CourseSlideBuilderPage = () => {
    const theme = useTheme();

    // State for slides
    const [slides, setSlides] = useState([
        {
            title: 'Introduction to Course',
            content: 'Welcome to this interactive learning experience.',
            layout: 'centered',
            backgroundTexture: 'parchment',
            image: null
        }
    ]);

    // Current slide being previewed
    const [currentSlide, setCurrentSlide] = useState(0);

    // Ref for slide preview container (for PDF export)
    const slidePreviewRef = useRef(null);
    const slideContentRef = useRef(null); // Add ref for the content area

    // Available background textures
    const backgroundTextures = [
        { name: 'parchment', label: 'Parchment', texture: darkParchmentTexture },
        { name: 'light-marble', label: 'Light Marble', texture: lightMarbleTexture },
        { name: 'grainy-marble', label: 'Grainy Marble', texture: grainyMarbleTexture },
        { name: 'crumbled-parchment', label: 'Crumbled Parchment', texture: crumbledParchmentTexture },
        { name: 'old-map', label: 'Old Map', texture: oldMapTexture }
    ];

    // Available slide layouts
    const slideLayouts = [
        { name: 'centered', label: 'Centered' },
        { name: 'title-content', label: 'Title & Content' },
        { name: 'two-column', label: 'Two Column' },
        { name: 'quote', label: 'Quote' },
        { name: 'image-text', label: 'Image & Text' }
    ];

    // Add a loading state near the top with other state variables
    const [isExporting, setIsExporting] = useState(false);

    // Handle adding a new slide
    const handleAddSlide = () => {
        setSlides([
            ...slides,
            {
                title: 'New Slide',
                content: 'Add your content here...',
                layout: 'centered',
                backgroundTexture: 'parchment',
                image: null
            }
        ]);
        setCurrentSlide(slides.length);
    };

    // Handle deleting a slide
    const handleDeleteSlide = (index) => {
        if (slides.length > 1) {
            const newSlides = slides.filter((_, i) => i !== index);
            setSlides(newSlides);
            setCurrentSlide(Math.min(currentSlide, newSlides.length - 1));
        }
    };

    // Handle slide content changes
    const handleSlideChange = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    };

    // Handle navigation between slides in preview
    const handlePrevSlide = () => {
        setCurrentSlide(Math.max(0, currentSlide - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1));
    };

    // Update the exportToPDF function
    const exportToPDF = async () => {
        // Capture the slide CONTENT area, not the whole preview container
        if (!slideContentRef.current) return;

        // Set loading state to true
        setIsExporting(true);

        try {
            // Create PDF with 16:9 aspect ratio
            const pdfWidth = 280; // mm
            const pdfHeight = 157.5; // 16:9 ratio (280 * 9/16)

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight] // Custom size with 16:9 ratio
            });

            // Store current slide to restore later
            const originalSlide = currentSlide;

            // Create PDF pages for each slide
            for (let i = 0; i < slides.length; i++) {
                // Change to the slide we want to capture
                setCurrentSlide(i);

                // Wait for render
                await new Promise(resolve => setTimeout(resolve, 100));

                // Capture the slide CONTENT using slideContentRef
                const canvas = await html2canvas(slideContentRef.current, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: theme.palette.parchment.main,
                    // Ensure the capture dimensions match the 16:9 aspect ratio of the content area
                    width: slideContentRef.current.offsetWidth,
                    height: slideContentRef.current.offsetHeight,
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);

                // Add it to PDF (first page is added, subsequent are added with addPage)
                if (i > 0) {
                    pdf.addPage([pdfWidth, pdfHeight]); // Ensure each page has the same 16:9 dimensions
                }

                // Add the image to fill the entire PDF page (canvas should now be 16:9)
                pdf.addImage(
                    imgData,
                    'JPEG',
                    0, 0,
                    pdfWidth, pdfHeight
                );
            }

            // Restore current slide
            setCurrentSlide(originalSlide);

            // Save the PDF with a generic filename
            pdf.save(`course-slides.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Optionally show an error message to the user
        } finally {
            // Set loading state back to false when done
            setIsExporting(false);
        }
    };

    // Get texture URL from name
    const getTextureUrl = (textureName) => {
        const texture = backgroundTextures.find(t => t.name === textureName);
        return texture ? texture.texture : darkParchmentTexture;
    };

    // Slide styles based on layout
    const getSlideStyles = (slide) => {
        const baseStyles = {
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing(4),
            background: theme.palette.parchment.main,
            color: theme.palette.text.primary,
            backgroundImage: `url(${getTextureUrl(slide.backgroundTexture)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(245, 239, 224, 0.85)', // Semi-transparent parchment overlay
                zIndex: 0
            },
            '& > *': {
                position: 'relative',
                zIndex: 1
            }
        };

        // Layout-specific styles
        switch (slide.layout) {
            case 'title-content':
                return {
                    ...baseStyles,
                    justifyContent: 'flex-start',
                    '& .slide-title': {
                        marginBottom: theme.spacing(6)
                    }
                };
            case 'two-column':
                return {
                    ...baseStyles,
                    '& .slide-content': {
                        display: 'flex',
                        gap: theme.spacing(4),
                        width: '100%',
                        '& > div': {
                            flex: 1
                        }
                    }
                };
            case 'quote':
                return {
                    ...baseStyles,
                    '& .slide-content': {
                        fontFamily: theme.typography.headingFontFamily,
                        fontStyle: 'italic',
                        fontSize: '1.5rem',
                        position: 'relative',
                        paddingLeft: theme.spacing(4),
                        '&::before': {
                            content: '"""',
                            position: 'absolute',
                            left: 0,
                            top: -10,
                            fontSize: '4rem',
                            color: theme.palette.sepia.main,
                            opacity: 0.4,
                            lineHeight: 1
                        }
                    }
                };
            case 'image-text':
                return {
                    ...baseStyles,
                    '& .slide-content': {
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: theme.spacing(4)
                    }
                };
            case 'centered':
            default:
                return baseStyles;
        }
    };

    // Add a function to handle image uploads
    const handleImageUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                // Update the current slide with the image data
                const newSlides = [...slides];
                newSlides[currentSlide] = {
                    ...newSlides[currentSlide],
                    image: e.target.result
                };
                setSlides(newSlides);
            };

            reader.readAsDataURL(file);
        }
    };

    // Render content based on slide layout
    const renderSlideContent = (slide) => {
        switch (slide.layout) {
            case 'title-content':
                return (
                    <>
                        <Typography
                            variant="h3"
                            className="slide-title"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                color: theme.palette.ink,
                                textAlign: 'center',
                                fontWeight: 600,
                                position: 'relative',
                                mb: 6,
                                pb: 1.5,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '30%',
                                    width: '40%',
                                    height: 2,
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                                    opacity: 0.8,
                                }
                            }}
                        >
                            {slide.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            className="slide-content"
                            sx={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: '1.25rem',
                                lineHeight: 1.7,
                                textAlign: 'left',
                                maxWidth: '85%',
                                color: theme.palette.inkLight,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {slide.content}
                        </Typography>
                    </>
                );
            case 'two-column':
                // Split the content at double line breaks for columns
                const columns = slide.content.split('\n\n');
                const leftColumn = columns[0] || '';
                const rightColumn = columns[1] || '';

                return (
                    <>
                        <Typography
                            variant="h3"
                            className="slide-title"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                color: theme.palette.ink,
                                textAlign: 'center',
                                fontWeight: 600,
                                marginBottom: 4,
                                position: 'relative',
                                pb: 1.5,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '35%',
                                    width: '30%',
                                    height: 2,
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.light}, transparent)`,
                                    opacity: 0.7,
                                }
                            }}
                        >
                            {slide.title}
                        </Typography>
                        <Box className="slide-content" sx={{ alignItems: 'flex-start' }}>
                            <Box sx={{ borderRight: `1px dashed ${theme.palette.sepia.main}40`, pr: 3 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.7,
                                        color: theme.palette.inkLight,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {leftColumn}
                                </Typography>
                            </Box>
                            <Box sx={{ pl: 3 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.7,
                                        color: theme.palette.inkLight,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {rightColumn}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                );
            case 'quote':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            padding: 4
                        }}
                    >
                        {/* Title (Optional for quote) */}
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                color: theme.palette.sepia.main,
                                textAlign: 'center',
                                fontWeight: 500,
                                marginBottom: 2,
                                fontSize: '1.2rem',
                            }}
                        >
                            {slide.title}
                        </Typography>

                        {/* Quote container */}
                        <Box sx={{
                            position: 'relative',
                            maxWidth: '75%',
                            textAlign: 'center',
                            my: 5,
                            px: { xs: 2, sm: 6 }
                        }}>
                            {/* Opening quote mark */}
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: -10,
                                    left: -20,
                                    fontFamily: theme.typography.headingFontFamily,
                                    fontSize: '6rem',
                                    lineHeight: 1,
                                    color: theme.palette.sepia.main,
                                    opacity: 0.2
                                }}
                            >
                                "
                            </Typography>

                            {/* Quote content */}
                            <Typography
                                sx={{
                                    fontFamily: theme.typography.headingFontFamily,
                                    fontStyle: 'italic',
                                    fontSize: '1.8rem',
                                    lineHeight: 1.6,
                                    color: theme.palette.ink,
                                    fontWeight: 500,
                                    mb: 2
                                }}
                            >
                                {slide.content}
                            </Typography>

                            {/* Closing quote mark */}
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    right: -20,
                                    fontFamily: theme.typography.headingFontFamily,
                                    fontSize: '6rem',
                                    lineHeight: 1,
                                    color: theme.palette.sepia.main,
                                    opacity: 0.2
                                }}
                            >
                                "
                            </Typography>
                        </Box>

                        {/* Stamp Logo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 30,
                                right: 30,
                                width: 50,
                                height: 50,
                                opacity: 0.3
                            }}
                        >
                            <img src={stampLogoTexture} alt="Stamp" style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Box>
                );
            case 'image-text':
                return (
                    <>
                        <Typography
                            variant="h3"
                            className="slide-title"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                color: theme.palette.ink,
                                textAlign: 'center',
                                fontWeight: 600,
                                marginBottom: 4,
                                position: 'relative',
                                pb: 1.5,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '35%',
                                    width: '30%',
                                    height: 2,
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.light}, transparent)`,
                                    opacity: 0.7,
                                }
                            }}
                        >
                            {slide.title}
                        </Typography>
                        <Box className="slide-content" sx={{ gap: 5 }}>
                            <Box
                                sx={{
                                    flex: '0 0 45%',
                                    aspectRatio: '16/9',
                                    background: theme.palette.parchmentDark,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    border: `1px solid ${theme.palette.sepia.main}30`,
                                    overflow: 'hidden',
                                    p: 0.5,
                                    boxShadow: `inset 0 0 5px ${theme.palette.ink}20`
                                }}
                            >
                                {slide.image ? (
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                ) : (
                                    <Typography sx={{ color: theme.palette.inkFaded, fontFamily: theme.typography.headingFontFamily }}>
                                        [Image Area]
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flex: '1 1 55%' }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: '1.2rem',
                                        lineHeight: 1.7,
                                        color: theme.palette.inkLight,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {slide.content}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                );
            case 'centered':
            default:
                return (
                    <>
                        <Typography
                            variant="h2"
                            className="slide-title"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                color: theme.palette.ink,
                                textAlign: 'center',
                                fontWeight: 600,
                                marginBottom: 3,
                                position: 'relative',
                                pb: 1.5,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '30%',
                                    width: '40%',
                                    height: 2,
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                                    opacity: 0.8,
                                }
                            }}
                        >
                            {slide.title}
                        </Typography>
                        <Typography
                            variant="h5"
                            className="slide-content"
                            sx={{
                                fontFamily: theme.typography.fontFamily,
                                textAlign: 'center',
                                marginTop: 4,
                                maxWidth: '75%',
                                color: theme.palette.inkLight,
                                fontSize: '1.3rem',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {slide.content}
                        </Typography>

                        {/* Stamp Logo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 30,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 50,
                                height: 50,
                                opacity: 0.2
                            }}
                        >
                            <img src={stampLogoTexture} alt="Stamp" style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </>
                );
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <GlobalStyles styles={{
                '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            }} />

            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontFamily: theme.typography.headingFontFamily,
                    fontWeight: 600,
                    color: theme.palette.ink,
                    mb: 1
                }}
            >
                Course Slide Builder
            </Typography>

            <Typography
                variant="h5"
                align="center"
                sx={{
                    fontFamily: theme.typography.fontFamily,
                    color: theme.palette.inkLight,
                    mb: 5,
                    maxWidth: 700,
                    mx: 'auto'
                }}
            >
                Create beautifully designed course slides with our Neo-Scholar theme. Fill in your content, preview the slides, and export to PDF.
            </Typography>

            <Grid container spacing={4}>
                {/* Slide Editor (Course Info section removed) */}
                <Grid item xs={12} md={5}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            backgroundColor: theme.palette.parchment.main,
                            border: `1px solid ${theme.palette.sepia.main}30`,
                            borderRadius: 2,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${darkParchmentTexture})`,
                                backgroundSize: 'cover',
                                opacity: 0.08,
                                mixBlendMode: 'multiply',
                                borderRadius: 2,
                                zIndex: 0,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: theme.typography.headingFontFamily,
                                    color: theme.palette.ink,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                Edit Slide {currentSlide + 1}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, position: 'relative', zIndex: 1 }}>
                                <Tooltip title="Previous Slide">
                                    <IconButton
                                        onClick={handlePrevSlide}
                                        disabled={currentSlide === 0}
                                        size="small"
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Tooltip>

                                <Typography
                                    sx={{
                                        lineHeight: '32px',
                                        color: theme.palette.inkLight
                                    }}
                                >
                                    {currentSlide + 1}/{slides.length}
                                </Typography>

                                <Tooltip title="Next Slide">
                                    <IconButton
                                        onClick={handleNextSlide}
                                        disabled={currentSlide === slides.length - 1}
                                        size="small"
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <TextField
                            label="Slide Title"
                            fullWidth
                            variant="outlined"
                            value={slides[currentSlide].title}
                            onChange={(e) => handleSlideChange(currentSlide, 'title', e.target.value)}
                            sx={{ mb: 2, position: 'relative', zIndex: 1 }}
                        />

                        <TextField
                            label="Slide Content"
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            value={slides[currentSlide].content}
                            onChange={(e) => handleSlideChange(currentSlide, 'content', e.target.value)}
                            helperText={slides[currentSlide].layout === 'two-column' ? "Use double line break to separate columns" : ""}
                            sx={{ mb: 2, position: 'relative', zIndex: 1 }}
                        />

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ position: 'relative', zIndex: 1 }}>
                                    <InputLabel>Layout</InputLabel>
                                    <Select
                                        value={slides[currentSlide].layout}
                                        label="Layout"
                                        onChange={(e) => handleSlideChange(currentSlide, 'layout', e.target.value)}
                                    >
                                        {slideLayouts.map(layout => (
                                            <MenuItem key={layout.name} value={layout.name}>
                                                {layout.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ position: 'relative', zIndex: 1 }}>
                                    <InputLabel>Background</InputLabel>
                                    <Select
                                        value={slides[currentSlide].backgroundTexture}
                                        label="Background"
                                        onChange={(e) => handleSlideChange(currentSlide, 'backgroundTexture', e.target.value)}
                                    >
                                        {backgroundTextures.map(texture => (
                                            <MenuItem key={texture.name} value={texture.name}>
                                                {texture.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Image upload for image-text layout */}
                        {slides[currentSlide].layout === 'image-text' && (
                            <Box sx={{ mt: 3, mb: 3, position: 'relative', zIndex: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    Upload Image
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        sx={{
                                            borderColor: theme.palette.sepia.main,
                                            color: theme.palette.ink,
                                            height: '100px',
                                            borderStyle: 'dashed',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {slides[currentSlide].image ? (
                                            <Box sx={{ height: '80px', display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={slides[currentSlide].image}
                                                    alt="Preview"
                                                    style={{
                                                        maxHeight: '80px',
                                                        maxWidth: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <>
                                                <AddIcon sx={{ mb: 1 }} />
                                                <Typography>Click to upload image</Typography>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageUpload}
                                        />
                                    </Button>

                                    {slides[currentSlide].image && (
                                        <Button
                                            variant="text"
                                            color="error"
                                            onClick={() => {
                                                const newSlides = [...slides];
                                                newSlides[currentSlide] = {
                                                    ...newSlides[currentSlide],
                                                    image: null
                                                };
                                                setSlides(newSlides);
                                            }}
                                            sx={{ mt: -1 }}
                                        >
                                            Remove Image
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ mb: 3, backgroundColor: theme.palette.sepia.main + '30' }} />

                        <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddSlide}
                                sx={{
                                    borderColor: theme.palette.sepia.main,
                                    color: theme.palette.ink
                                }}
                            >
                                Add Slide
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteSlide(currentSlide)}
                                disabled={slides.length <= 1}
                            >
                                Delete Slide
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Slide Preview */}
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={0}
                        sx={{
                            backgroundColor: theme.palette.parchment.light,
                            border: `1px solid ${theme.palette.sepia.main}30`,
                            borderRadius: 2,
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${darkParchmentTexture})`,
                                backgroundSize: 'cover',
                                opacity: 0.05,
                                mixBlendMode: 'multiply',
                                borderRadius: 2,
                                zIndex: 0,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: theme.typography.headingFontFamily,
                                    color: theme.palette.ink
                                }}
                            >
                                Preview
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={exportToPDF}
                                sx={{
                                    backgroundColor: theme.palette.ink,
                                    '&:hover': {
                                        backgroundColor: theme.palette.inkLight
                                    }
                                }}
                            >
                                Export to PDF
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                position: 'relative',
                                zIndex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Preview Container (maintains 16:9) */}
                            <Box
                                ref={slidePreviewRef} // Ref for the outer container (aspect ratio)
                                sx={{
                                    width: '100%',
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    // Create 16:9 aspect ratio using padding trick
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%', // 16:9
                                    },
                                    flex: 1,
                                    mb: 3 // Ensure margin is outside the overlay container
                                }}
                            >
                                {/* Absolute container for overlaying content */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Slide content Area - Now takes full height */}
                                    <Box
                                        ref={slideContentRef} // Add ref to the actual content area
                                        sx={{
                                            ...getSlideStyles(slides[currentSlide]),
                                            flex: 1, // Allow content to fill remaining space
                                            width: '100%', // Ensure it takes full width
                                            height: '100%' // Ensure it takes full height within the flex container
                                        }}
                                    >
                                        {renderSlideContent(slides[currentSlide])}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Mini slide navigator */}
                        <Box
                            sx={{
                                mt: 3,
                                display: 'flex',
                                gap: 1,
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}
                        >
                            {slides.map((slide, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    sx={{
                                        width: 80,
                                        height: 45,
                                        borderRadius: 1,
                                        border: currentSlide === index
                                            ? `2px solid ${theme.palette.ink}`
                                            : `1px solid ${theme.palette.sepia.main}30`,
                                        cursor: 'pointer',
                                        backgroundColor: theme.palette.parchment.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        boxShadow: currentSlide === index
                                            ? `0 0 0 2px ${theme.palette.sepia.main}50`
                                            : 'none',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundImage: `url(${getTextureUrl(slide.backgroundTexture)})`,
                                            backgroundSize: 'cover',
                                            opacity: 0.1,
                                            zIndex: 0
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'relative',
                                            zIndex: 1,
                                            fontWeight: currentSlide === index ? 'bold' : 'normal',
                                            color: theme.palette.ink
                                        }}
                                    >
                                        Slide {index + 1}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Loading Overlay */}
            {isExporting && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(245, 239, 224, 0.7)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(3px)'
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: 100,
                            height: 100,
                            opacity: 0.8
                        }}
                    >
                        <img
                            src={stampLogoTexture}
                            alt="Loading"
                            style={{
                                width: '100%',
                                height: '100%',
                                animation: 'spin 2s linear infinite'
                            }}
                        />
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            color: theme.palette.ink,
                            mt: 2,
                            fontWeight: 500
                        }}
                    >
                        Compiling PDF...
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default CourseSlideBuilderPage; 