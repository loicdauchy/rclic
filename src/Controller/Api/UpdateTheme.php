<?php

namespace App\Controller\Api;

use App\Repository\UsersRepository;
use App\Repository\AppointmentsRepository;
use App\Repository\SmsListRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class UpdateTheme extends AbstractController
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
     * UpdateTheme constructor.
     * @param UsersRepository $userRepo
     * @param AppointmentsRepository $appointmentRepository
     * @param SmsListRepository $smsListRepository
     * @param EntityManagerInterface $em
     */
    public function __construct(
                                UsersRepository $userRepo,
                                AppointmentsRepository $appointmentRepository,
                                SmsListRepository $smsListRepository,
                                EntityManagerInterface $em
                               )
    {
        $this->userRepository = $userRepo;
        $this->appointmentRepository = $appointmentRepository;
        $this->smsListRepository = $smsListRepository;
        $this->em = $em;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($data, $id)
    {
        $users = $this->userRepository->find($id);

        if($users->getTheme() === "dark"){
            $users->setTheme('light');
        }else{
            $users->setTheme('dark');
        }


        $this->em->persist($users);
        $this->em->flush();

        return [
            'message' => 'success'
        ];
    }
}