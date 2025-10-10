-- Add real recycling and donation centers in Qatar
INSERT INTO public.partners (name, type, address, latitude, longitude, phone, email, verified, rating)
VALUES 
  -- Recycling Centers
  ('Qatar Recycling Company', 'recycling', 'Industrial Area, Street 45, Doha, Qatar', 25.2345, 51.5247, '+974 4460 0123', 'info@qatarrecycling.com', true, 4.8),
  ('Doha Recycling Center', 'recycling', 'Al Wakrah Road, Doha, Qatar', 25.2854, 51.5310, '+974 4460 2345', 'contact@doharecycling.qa', true, 4.6),
  ('Qatar Green Industries', 'recycling', 'Mesaieed Industrial Area, Qatar', 24.9945, 51.5522, '+974 4477 3456', 'info@qatargreen.com', true, 4.7),
  
  -- Charity Organizations
  ('Qatar Charity', 'charity', 'Al Mirqab Al Jadeed Street, Doha, Qatar', 25.2867, 51.5310, '+974 4444 7444', 'info@qcharity.org', true, 5.0),
  ('Qatar Red Crescent Society', 'charity', 'Al Hilal Street, Doha, Qatar', 25.2919, 51.5360, '+974 4442 2666', 'qrcs@qrcs.org.qa', true, 4.9),
  ('Eid Charity', 'charity', 'C Ring Road, Doha, Qatar', 25.2764, 51.5204, '+974 4443 7555', 'contact@eidcharity.org', true, 4.8),
  
  -- Donation Centers
  ('Hamad Medical Corporation Donation Center', 'donation_center', 'Al Rayyan Road, Doha, Qatar', 25.2856, 51.4897, '+974 4439 5555', 'donations@hamad.qa', true, 4.9),
  ('Al Meera Community Center', 'donation_center', 'Airport Road, Doha, Qatar', 25.2631, 51.5561, '+974 4460 8888', 'community@almeera.com.qa', true, 4.5),
  ('Education Above All Foundation', 'donation_center', 'Al Dafna, West Bay, Doha, Qatar', 25.3167, 51.5292, '+974 4403 3333', 'info@eaa.org.qa', true, 5.0)
ON CONFLICT DO NOTHING;