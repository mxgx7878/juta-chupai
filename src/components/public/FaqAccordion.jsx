"use client";

import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { colors, motion } from "@/theme/tokens";

/**
 * Accessible FAQ list. The same `faqs` array also feeds FAQPage JSON-LD on the
 * page that renders this, so the answers shown here are the answers Google sees.
 */
export default function FaqAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <Stack spacing={1.5}>
      {faqs.map((faq, i) => (
        <Accordion
          key={faq.question}
          expanded={open === i}
          onChange={() => setOpen(open === i ? -1 : i)}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: open === i ? colors.primary : colors.border,
            borderRadius: "var(--jc-radius-md) !important",
            bgcolor: open === i ? colors.primarySoft : colors.surface,
            transition: `border-color ${motion.base} ${motion.ease}, background-color ${motion.base} ${motion.ease}`,
            "&::before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: { xs: 2, md: 2.5 }, py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15.5 }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5, pt: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
