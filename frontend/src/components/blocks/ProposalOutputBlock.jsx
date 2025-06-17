import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Grid,
    useTheme,
    useMediaQuery,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { FileText, Clock, DollarSign, CheckCircle } from 'lucide-react';
import DotBridgeCard from '../DotBridgeCard';
import { useFunnel } from '../../contexts/FunnelContext';

const ProposalOutputBlock = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { proposalData } = useFunnel();
    const [selectedPackageIndex, setSelectedPackageIndex] = React.useState(null);

    React.useEffect(() => {
        if (proposalData && proposalData.recommendedPackage !== undefined) {
            setSelectedPackageIndex(proposalData.recommendedPackage);
        }
    }, [proposalData]);

    if (!proposalData) {
        return null;
    }

    const {
        summary,
        packages = [],
        recommendedPackage = 0,
        customizationNotes,
        projectScope,
        valueProposition,
        nextSteps,
        riskMitigation,
        uniqueInsights,
        technicalApproach,
        clientContext
    } = proposalData;

    const formatPriceRange = (priceRange) => {
        const min = `$${(priceRange.min / 100).toLocaleString()}`;
        const max = `$${(priceRange.max / 100).toLocaleString()}`;
        return `${min} - ${max}`;
    };

    const formatTimelineRange = (timelineRange) => {
        const { min, max } = timelineRange;
        if (min === max) {
            return `${min} ${min === 1 ? 'day' : 'days'}`;
        }
        if (max <= 7) {
            return `${min}-${max} days`;
        }
        if (max <= 30) {
            return `${Math.ceil(min / 7)}-${Math.ceil(max / 7)} weeks`;
        }
        return `${Math.ceil(min / 30)}-${Math.ceil(max / 30)} months`;
    };

    const selectedPackage = selectedPackageIndex !== null ? packages[selectedPackageIndex] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <DotBridgeCard sx={{
                width: '100%',
                p: { xs: 2, sm: 3, md: 4 },
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}05 100%)`,
                border: `2px solid ${theme.palette.primary.light}`,
                borderRadius: { xs: 2, md: 3 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                }
            }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                    <Typography variant="h3" sx={{
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
                        lineHeight: { xs: 1.3, md: 1.2 },
                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Your Custom AI Strategy
                    </Typography>
                </Box>

                {/* Summary Section */}
                <Paper sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
                    border: `1px solid ${theme.palette.primary.main}20`,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <FileText size={20} />
                        Project Summary
                    </Typography>
                    <Typography variant="body1" sx={{
                        lineHeight: 1.7,
                        color: theme.palette.text.primary
                    }}>
                        {summary}
                    </Typography>
                </Paper>

                {/* Package Selection */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        mb: { xs: 2, md: 3 },
                        textAlign: 'center',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                    }}>
                        Choose Your Package
                    </Typography>

                    <Grid container spacing={3}>
                        {packages.map((pkg, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    style={{ height: '100%' }}
                                >
                                    <Paper
                                        onClick={() => setSelectedPackageIndex(index)}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            border: `2px solid ${selectedPackageIndex === index ? theme.palette.primary.main : theme.palette.divider}`,
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            background: selectedPackageIndex === index
                                                ? `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.primary.main}10 100%)`
                                                : 'transparent',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.light,
                                                transform: 'translateY(-5px)',
                                                boxShadow: `0 8px 24px ${theme.palette.primary.main}15`
                                            }
                                        }}
                                    >
                                        {index === recommendedPackage && (
                                            <Chip
                                                label="RECOMMENDED"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: -10,
                                                    right: 16,
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}

                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: selectedPackageIndex === index ? theme.palette.primary.main : theme.palette.text.primary
                                        }}>
                                            {pkg.name}
                                        </Typography>

                                        <Typography variant="body2" sx={{
                                            mb: 2,
                                            color: theme.palette.text.secondary
                                        }}>
                                            {pkg.description}
                                        </Typography>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 700,
                                                color: theme.palette.primary.main,
                                                mb: 0.5
                                            }}>
                                                {formatPriceRange(pkg.priceRange)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatTimelineRange(pkg.timelineRange)}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="body2" sx={{
                                            fontStyle: 'italic',
                                            color: theme.palette.text.secondary,
                                            mb: 2
                                        }}>
                                            {pkg.ideal_for}
                                        </Typography>

                                        <Box>
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 600,
                                                mb: 1
                                            }}>
                                                Key Deliverables:
                                            </Typography>
                                            {pkg.deliverables.slice(0, 3).map((deliverable, idx) => (
                                                <Box key={idx} sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 1,
                                                    mb: 0.5
                                                }}>
                                                    <CheckCircle
                                                        size={14}
                                                        color={theme.palette.success.main}
                                                        style={{ marginTop: 2, flexShrink: 0 }}
                                                    />
                                                    <Typography variant="caption">
                                                        {deliverable}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {pkg.deliverables.length > 3 && (
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 600
                                                }}>
                                                    +{pkg.deliverables.length - 3} more...
                                                </Typography>
                                            )}
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Selected Package Details */}
                {selectedPackage && (
                    <Box sx={{ mb: 4 }}>
                        <Paper sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}03 100%)`,
                            border: `1px solid ${theme.palette.primary.main}20`,
                            borderRadius: 2
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: theme.palette.primary.main
                            }}>
                                Selected Package: {selectedPackage.name}
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <DollarSign size={32} color={theme.palette.success.main} />
                                        <Typography variant="h5" sx={{
                                            fontWeight: 700,
                                            my: 1,
                                            color: theme.palette.success.main
                                        }}>
                                            {formatPriceRange(selectedPackage.priceRange)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Investment Range
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Clock size={32} color={theme.palette.secondary.main} />
                                        <Typography variant="h5" sx={{
                                            fontWeight: 700,
                                            my: 1,
                                            color: theme.palette.secondary.main
                                        }}>
                                            {formatTimelineRange(selectedPackage.timelineRange)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Estimated Timeline
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                )}

                {/* Deliverables */}
                {selectedPackage && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CheckCircle size={20} color={theme.palette.success.main} />
                            What You'll Get
                        </Typography>

                        <Box sx={{ pl: { xs: 0, sm: 3 } }}>
                            {selectedPackage.deliverables.map((deliverable, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5,
                                        mb: 2
                                    }}>
                                        <CheckCircle
                                            size={18}
                                            color={theme.palette.success.main}
                                            style={{ marginTop: 2, flexShrink: 0 }}
                                        />
                                        <Typography variant="body1" sx={{
                                            lineHeight: 1.6,
                                            color: theme.palette.text.primary
                                        }}>
                                            {deliverable}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Customization Notes */}
                {customizationNotes && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.info.main}08 0%, ${theme.palette.info.main}03 100%)`,
                        border: `1px solid ${theme.palette.info.main}20`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: theme.palette.info.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <FileText size={20} />
                            Customization for Your Needs
                        </Typography>
                        <Typography variant="body1" sx={{
                            lineHeight: 1.7,
                            color: theme.palette.text.primary
                        }}>
                            {customizationNotes}
                        </Typography>
                    </Paper>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Value Proposition */}
                {valueProposition && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}08 0%, ${theme.palette.success.main}03 100%)`,
                        border: `1px solid ${theme.palette.success.main}20`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: theme.palette.success.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CheckCircle size={20} />
                            Why This Investment Makes Sense
                        </Typography>
                        <Typography variant="body1" sx={{
                            lineHeight: 1.7,
                            color: theme.palette.text.primary,
                            fontWeight: 500
                        }}>
                            {valueProposition}
                        </Typography>
                    </Paper>
                )}

                {/* Project Scope Details */}
                {projectScope && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {projectScope.technical_requirements && (
                            <Grid item xs={12} sm={6} lg={4}>
                                <Paper sx={{
                                    p: 2.5,
                                    height: '100%',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        color: theme.palette.primary.main
                                    }}>
                                        Technical Requirements
                                    </Typography>
                                    {projectScope.technical_requirements.map((req, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                            mb: 1
                                        }}>
                                            <CheckCircle
                                                size={16}
                                                color={theme.palette.primary.main}
                                                style={{ marginTop: 2, flexShrink: 0 }}
                                            />
                                            <Typography variant="body2">
                                                {req}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        )}

                        {projectScope.business_objectives && (
                            <Grid item xs={12} sm={6} lg={4}>
                                <Paper sx={{
                                    p: 2.5,
                                    height: '100%',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        color: theme.palette.secondary.main
                                    }}>
                                        Business Objectives
                                    </Typography>
                                    {projectScope.business_objectives.map((obj, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                            mb: 1
                                        }}>
                                            <CheckCircle
                                                size={16}
                                                color={theme.palette.secondary.main}
                                                style={{ marginTop: 2, flexShrink: 0 }}
                                            />
                                            <Typography variant="body2">
                                                {obj}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        )}

                        {projectScope.success_metrics && (
                            <Grid item xs={12} sm={6} lg={4}>
                                <Paper sx={{
                                    p: 2.5,
                                    height: '100%',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        color: theme.palette.success.main
                                    }}>
                                        Success Metrics
                                    </Typography>
                                    {projectScope.success_metrics.map((metric, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                            mb: 1
                                        }}>
                                            <CheckCircle
                                                size={16}
                                                color={theme.palette.success.main}
                                                style={{ marginTop: 2, flexShrink: 0 }}
                                            />
                                            <Typography variant="body2">
                                                {metric}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Next Steps */}
                {nextSteps && nextSteps.length > 0 && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.info.main}08 0%, ${theme.palette.info.main}03 100%)`,
                        border: `1px solid ${theme.palette.info.main}20`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: theme.palette.info.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <FileText size={20} />
                            Next Steps
                        </Typography>
                        <Box sx={{ pl: { xs: 0, sm: 3 } }}>
                            {nextSteps.map((step, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    mb: 1.5
                                }}>
                                    <Box sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: theme.palette.info.main,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Typography variant="body1" sx={{
                                        lineHeight: 1.6,
                                        color: theme.palette.text.primary
                                    }}>
                                        {step}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                {/* Technical Approach */}
                {technicalApproach && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.secondary.main}03 100%)`,
                        border: `1px solid ${theme.palette.secondary.main}20`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: theme.palette.secondary.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <FileText size={20} />
                            Technical Approach
                        </Typography>
                        <Typography variant="body1" sx={{
                            lineHeight: 1.7,
                            color: theme.palette.text.primary
                        }}>
                            {technicalApproach}
                        </Typography>
                    </Paper>
                )}

                {/* Unique Insights */}
                {uniqueInsights && uniqueInsights.length > 0 && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}08 0%, ${theme.palette.warning.main}03 100%)`,
                        border: `1px solid ${theme.palette.warning.main}20`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: theme.palette.warning.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CheckCircle size={20} />
                            Strategic Insights
                        </Typography>
                        <Box sx={{ pl: { xs: 0, sm: 3 } }}>
                            {uniqueInsights.map((insight, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    mb: 1.5
                                }}>
                                    <CheckCircle
                                        size={16}
                                        color={theme.palette.warning.main}
                                        style={{ marginTop: 2, flexShrink: 0 }}
                                    />
                                    <Typography variant="body1" sx={{
                                        lineHeight: 1.6,
                                        color: theme.palette.text.primary
                                    }}>
                                        {insight}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                {/* Client Context */}
                {clientContext && (
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        background: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: theme.palette.text.primary
                        }}>
                            Project Context
                        </Typography>
                        <Grid container spacing={2}>
                            {clientContext.industry && (
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Industry
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {clientContext.industry}
                                    </Typography>
                                </Grid>
                            )}
                            {clientContext.companySize && (
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Company Size
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {clientContext.companySize}
                                    </Typography>
                                </Grid>
                            )}
                            {clientContext.technicalMaturity && (
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tech Maturity
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {clientContext.technicalMaturity}
                                    </Typography>
                                </Grid>
                            )}
                            {clientContext.urgency && (
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Urgency
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {clientContext.urgency}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                )}

            </DotBridgeCard>
        </motion.div>
    );
};

export default ProposalOutputBlock; 