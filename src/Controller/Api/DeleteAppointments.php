<?php

namespace App\Controller\Api;

use App\Manager\SmsManager;
use App\Repository\UsersRepository;
use App\Repository\AppointmentsRepository;
use App\Repository\SmsListRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class DeleteAppointments extends AbstractController
{
    /**
     * @var UsersRepository
     */
    protected $userRepo;

    /**
     * @var AppointmentsRepository
     */
    protected $appointmentRepository;

    /**
     * @var SmsListRepository
     */
    protected $smsListRepository;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var SmsManager
     */
    protected $smsManager;

    /**
     * GetAppointments constructor.
     * @param UsersRepository $userRepo
     * @param AppointmentsRepository $appointmentRepository
     * @param SmsListRepository $smsListRepository
     * @param EntityManagerInterface $em
     * @param SmsManager $smsManager
     */
    public function __construct(
                                UsersRepository $userRepo,
                                AppointmentsRepository $appointmentRepository,
                                SmsListRepository $smsListRepository,
                                EntityManagerInterface $em,
                                SmsManager $smsManager
                               )
    {
        $this->userRepository = $userRepo;
        $this->appointmentRepository = $appointmentRepository;
        $this->smsListRepository = $smsListRepository;
        $this->em = $em;
        $this->smsManager = $smsManager;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($id)
    {
        $rdv = $this->appointmentRepository->find($id);

        if($this->smsListRepository->findByRdv($rdv)){

            $smsList = $this->smsListRepository->findByRdv($rdv)[0];
            $infos = $smsList->getInfos();

            $parse = substr($infos, strpos($infos, "|") + 1);  
            $smsId = substr($parse, strpos($parse, "|") + 2);  
            $str= str_replace("\n","",$smsId);

            $this->smsManager->deleteSms(
                "x83B1b2YPUeNzilSS74oGqVzIG5T90qC",
                $str
            );
        }

        $this->em->remove($rdv);
        $this->em->flush();

        return [
            'message' => 'success'
        ];
    }
}