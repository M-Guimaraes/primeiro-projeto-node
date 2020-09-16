import { startOfHour } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';

import IAppointementsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(
    private appointmentsRepository: IAppointementsRepository ) { }

  public async execute({
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 401);
    }
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });
    return appointment;
  }
}

export default CreateAppointmentService;