<?php

namespace App\Controller\Api;

use App\Repository\UsersRepository;
use App\Repository\AppointmentsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class GetCollaborateur extends AbstractController
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
     * GetCollaborateur constructor.
     * @param UsersRepository $userRepo
     * @param AppointmentsRepository $appointmentRepository
     */
    public function __construct(
                                UsersRepository $userRepo,
                                AppointmentsRepository $appointmentRepository
                               )
    {
        $this->userRepository = $userRepo;
        $this->appointmentRepository = $appointmentRepository;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($id)
    {
        $collaborateurs = $this->userRepository->findCollaborateur($id);

        return [
            'collaborateurs' => $collaborateurs,
            'message' => 'success',
        ];
    }
}