-- Loosen demo restaurant booking: every day 12:00–22:00, no Monday closure

UPDATE restaurant_settings
SET
  open_time = '12:00',
  close_time = '22:00',
  lunch_enabled = true,
  lunch_open_time = '12:00',
  lunch_close_time = '22:00',
  dinner_enabled = false,
  closed_weekdays = '',
  min_notice_hours = 0,
  advance_booking_days = 90,
  max_covers_per_slot = 80,
  max_covers_per_evening = 200,
  max_party_size = 80,
  min_party_size = 1,
  require_email = false,
  require_phone = true,
  reservations_enabled = true,
  chatbot_welcome_message = 'Hei! Autan pöytävarauksessa — kerro nimesi, henkilömäärä, päivä, kellonaika (12–22) ja puhelinnumero. Sähköposti on vapaaehtoinen. Normaali pöytäaika on 2 tuntia; 3 tuntia onnistuu pyynnöstä.',
  chatbot_instructions = 'Varaukset joka päivä klo 12:00–22:00. Normaali kesto 2 tuntia; 3 tuntia pyynnöstä. Sähköposti ei ole pakollinen — puhelin riittää. Älä torju varauksia turhaan — ole joustava.',
  updated_at = NOW()
WHERE id = 'default';
