-- Tutor availability and booking access policies for Supabase.

create policy "Tutors can create their own tutor profile"
on tutors for insert
with check (auth.uid() = id);

create policy "Tutors can update their own tutor profile"
on tutors for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Tutors can manage their own availability"
on availability_slots for insert
with check (auth.uid() = tutor_id);

create policy "Tutors can update their own availability"
on availability_slots for update
using (auth.uid() = tutor_id)
with check (auth.uid() = tutor_id);

create policy "Tutors can delete their own availability"
on availability_slots for delete
using (auth.uid() = tutor_id);

create policy "Students can create their own booking"
on bookings for insert
with check (auth.uid() = student_id);

create policy "Students can update their own booking"
on bookings for update
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

create policy "Tutors can update their own bookings"
on bookings for update
using (auth.uid() = tutor_id)
with check (auth.uid() = tutor_id);
